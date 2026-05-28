const urls = [
  "https://senecahealthads.com/pages/snc-vslfb-test",
  "https://senecahealthads.com/pages/snc-vslfb-test-v1",
  "https://senecahealthads.com/pages/snc-vslfb-test-v2"
];

const TOTAL_REQUESTS = 200;
const CONCURRENT_BATCH = 25;

const results = {};

urls.forEach(url => {
  results[url] = 0;
});

async function hitUrl(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "GitHubActionsSplitTestBot/1.0"
      }
    });

    if (res.ok) {
      results[url]++;
    }
  } catch (err) {
    console.error(`Failed: ${url}`);
  }
}

async function runBatch(size) {
  const jobs = [];

  for (let i = 0; i < size; i++) {
    const selected =
      urls[Math.floor(Math.random() * urls.length)];

    jobs.push(hitUrl(selected));
  }

  await Promise.all(jobs);
}

async function main() {
  const batches = Math.ceil(
    TOTAL_REQUESTS / CONCURRENT_BATCH
  );

  for (let i = 0; i < batches; i++) {
    await runBatch(CONCURRENT_BATCH);

    console.log(
      `Completed batch ${i + 1}/${batches}`
    );
  }

  console.log("\n=== FINAL RESULTS ===\n");

  console.table(results);
}

main();