<?php

class Spliter
{
    private array $variations;
    private string $dataFile;
    private array $views;
    private string $cacheKey = 'spliter_views';

    public function __construct(array $variations, string $dataFile)
    {
        array_unshift($variations, 'CONTROL'); // Prepend "CONTROL"
        $this->variations = array_values($variations);
        $this->dataFile = $dataFile;

        $this->views = $this->safeLoadData();
        $this->initializeCounts();
    }

    public function getNextVariation(): string|false
    {
        try {
            if (empty($this->views)) {
                // return false;
                return $this->getRandVariant();
            }

            $minViews = min($this->views);

            $candidates = array_keys(array_filter($this->views, function ($count) use ($minViews) {
                return $count === $minViews;
            }));

            if (empty($candidates)) {
                // return false;
                return $this->getRandVariant();
            }

            $nextUrl = $candidates[array_rand($candidates)];
            $this->views[$nextUrl]++;
            $this->safeSaveData();

            return $nextUrl;
        } catch (Throwable $e) {
            error_log("Spliter Error: " . $e->getMessage());
            return false;
        }
    }

    public function resetViews(): void
    {
        $this->views = [];
        foreach ($this->variations as $url) {
            $this->views[$url] = 0;
        }
        $this->safeSaveData();
    }

    public function getViewStats(): array
    {
        return $this->views;
    }

    public static function resolveDataFilePath(string $filename): string
    {
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
        foreach ($backtrace as $trace) {
            if (isset($trace['file']) && $trace['file'] !== __FILE__) {
                return dirname($trace['file']) . DIRECTORY_SEPARATOR . $filename;
            }
        }
        return __DIR__ . DIRECTORY_SEPARATOR . $filename;
    }

    private function initializeCounts(): void
    {
        $storedKeys = array_keys($this->views);
        $currentKeys = $this->variations;

        sort($storedKeys);
        sort($currentKeys);

        if ($storedKeys !== $currentKeys) {
            $this->resetViews();
            return;
        }

        foreach ($this->variations as $url) {
            if (!isset($this->views[$url])) {
                $this->views[$url] = 0;
            }
        }

        foreach (array_keys($this->views) as $url) {
            if (!in_array($url, $this->variations, true)) {
                unset($this->views[$url]);
            }
        }
    }

    private function safeLoadData(): array
    {
        if (function_exists('apcu_fetch')) {
            $cached = apcu_fetch($this->cacheKey);
            if ($cached !== false) {
                return $cached;
            }
        }

        $retries = 5;
        $delay = 10000;

        for ($i = 0; $i < $retries; $i++) {
            if (!file_exists($this->dataFile)) {
                return [];
            }

            $fp = fopen($this->dataFile, 'r');
            if ($fp && flock($fp, LOCK_SH)) {
                $json = fread($fp, filesize($this->dataFile));
                flock($fp, LOCK_UN);
                fclose($fp);

                $data = json_decode($json, true);
                if (is_array($data)) {
                    if (function_exists('apcu_store')) {
                        apcu_store($this->cacheKey, $data);
                    }
                    return $data;
                }
                return [];
            }

            if ($fp) fclose($fp);
            usleep($delay);
        }

        throw new RuntimeException("Failed to load view data after multiple attempts.");
    }

    private function safeSaveData(): void
    {
        $retries = 5;
        $delay = 10000;

        for ($i = 0; $i < $retries; $i++) {
            $fp = fopen($this->dataFile, 'c+');
            if ($fp && flock($fp, LOCK_EX)) {
                ftruncate($fp, 0);
                rewind($fp);
                fwrite($fp, json_encode($this->views, JSON_PRETTY_PRINT));
                fflush($fp);
                flock($fp, LOCK_UN);
                fclose($fp);

                if (function_exists('apcu_store')) {
                    apcu_store($this->cacheKey, $this->views);
                }

                return;
            }

            if ($fp) fclose($fp);
            usleep($delay);
        }

        throw new RuntimeException("Failed to save view data after multiple attempts.");
    }


    private function getRandVariant() {
        $totalUrls = count($this->variations);
        $index = $this->getIndex($totalUrls);
        return $this->variations[$index];
    }

    private function getIndex($totalUrls) {
        // Generate a random index within the range of total URLs
        $index = mt_rand(0, $totalUrls - 1);
        return $index;
    }
}
