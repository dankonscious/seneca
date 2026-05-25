<?php
class SplitTester {
    private $urls;

    public function __construct(array $urls) {
        array_push($urls, false);
        $this->urls = $urls;
        $url = $this->getVariant();
        if($url) $this->redirect($url);
    }

    private function getVariant() {
        $totalUrls = count($this->urls);
        $index = $this->getIndex($totalUrls);
        return $this->urls[$index];
    }

    private function getIndex($totalUrls) {
        // Generate a random index within the range of total URLs
        $index = mt_rand(0, $totalUrls - 1);
        return $index;
    }

    public function redirect($url)
    {
        header('Location: '.$url, true, 302);
	    die();
    }
}
?>