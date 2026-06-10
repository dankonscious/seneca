<?php
if (@$_GET["test"] != "false") {
  $qs = ($_SERVER["QUERY_STRING"] ? "?" : "") . $_SERVER["QUERY_STRING"];

  require_once("../../splittester/splittester.class.php");

  $urls = array(
    "pages/snc-vslfb-test$qs",
    "http://senecahealthads.com/pages/snc-vslfb-test-dup$qs",
    "https://senecahealthads.com/pages/snc-vslfb-test-v1$qs",
    "https://senecahealthads.com/pages/snc-vslfb-test-v2$qs",
    "https://senecahealthads.com/pages/snc-vslfb-test-v3$qs"
  );

  $split = new SplitTester($urls);
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Microbiome Restoration</title>
  <link rel="icon" type="image/png"
    href="https://d3j6ngx7p7lglj.cloudfront.net/perfectdigestion.com/pages/snc-vslfb/images/favicon.svg">
  <!-- <link rel="stylesheet" href="https://perfectdigestion.com/pages/snc-vslfb/css/tailwind.output.css" /> -->
  <link rel="stylesheet" href="https://perfectdigestion.com/pages/snc-vslfb/css/tailwind.output.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet">
  <!-- Load Optimized Script -->
  <script src="https://d3j6ngx7p7lglj.cloudfront.net/global/js/kk.main.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      // ✅ Run initialization on page load
      if (scriptLoader) {
        scriptLoader.disableScripts = ['wistia'];
        scriptLoader.loadAllScripts([
          scriptLoader.loadGTM('GTM-56TX85F'),
          scriptLoader.loadGA(['AW-770742054']),
        ]);
      }
    });  
  </script>
  <script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
</head>

<body>
  <h1>Replace my heading</h1>
  <h2>Replace my subheading</h2>
  <h3>Replace my sub-subheading</h3>
 
  <img src="https://d3j6ngx7p7lglj.cloudfront.net/seneca/pages/snc-vslfb-test-v2/large-image.webp?v=1781106848291" alt="Large Image"/>
  
  <a href="https://go.gutperfection.com/products/seneca-1-pack-snc-test-v1#params">
    https://go.gutperfection.com/products/seneca-1-pack-snc-test-v1
  </a>
  
  <a href="https://go.gutperfection.com/products/seneca-3-pack-snc-test-v1#params">
    https://go.gutperfection.com/products/seneca-3-pack-snc-test-v1
  </a>

  <a href="https://go.gutperfection.com/products/seneca-6-pack-snc-test-v1#params">
    https://go.gutperfection.com/products/seneca-6-pack-snc-test-v1
  </a>
</body>

</html>