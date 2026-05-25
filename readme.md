# Installation & Quick Start

### 1. Install Project Dependencies
Install all required packages for the project:
```
npm install
```

### 2. Install Development Tools

a. Install Concurrently
```
npm install -D concurrently
```

b. Tailwind CSS (v3)
Install Tailwind CSS version 3 for styling:
```
npm install -D tailwindcss@3
```

### 3. Run Tailwind for a Specific Page

Compile Tailwind CSS for a page of your choice:
- Watch the root page (index.html)
    ```
    npm run encdev
    ```
    By default, this watches index.html in the root folder and rebuilds Tailwind CSS on changes.
    
- Watch a specific page
    ```
    npm run encdev --page=[page_name]
    ```
    Replace [page_name] with the path to the page you want to watch.


# CI/CD Asset Pipeline with GitHub Actions

This repository contains an automated deployment and asset optimization workflow powered by **GitHub Actions**. The workflow simplifies deployment and asset handling by automatically processing images and uploading them to the correct infrastructure.

## Overview

The CI/CD pipeline performs the following tasks automatically when changes are pushed to the repository:

1. Processes and optimizes images
2. Converts images to **WebP** format
3. Uploads assets to an **AWS S3 bucket**
4. Deploys project files to the server via **FTP**

This workflow ensures assets are optimized and consistently organized without requiring manual intervention.




## Tailwind 3.0
This project uses Tailwind CSS 3.0 with a custom prefix to avoid class conflicts. Each landing page has its own input and output CSS files.

### Tailwind CSS v3 Installation
```
npm install -D tailwindcss@3
```

### Prefix
```bash
enc-[tailwind class]
```

### Folder Structure per Page
```bash
root/
├─ index.php
├─ css/
│  ├─ tailwind.input.css
│  └─ tailwind.output.css
└─ pages/
   └─ [page_name]/
      ├─ css/
      │  ├─ tailwind.input.css
      │  └─ tailwind.output.css
```
- tailwind.input.css – the Tailwind source file for the page
- tailwind.output.css – the compiled CSS file used in the page

### Development (Watch Mode)

To compile Tailwind for a page and watch for changes:
```bash
npm run encdev --page=[page_name]
```

⚡ Only run --watch for the page you are actively editing to avoid multiple processes running simultaneously.

## Folder Structure

Images uploaded to AWS follow a standardized structure:

```
{repository_name}/pages/images/
```

Example:

```
my-repo/pages/images/hero.webp
```

This structure helps keep assets organized across multiple repositories and projects.

## Workflow Steps

### 1. Trigger

The workflow runs automatically when code is pushed to the main branch.

### 2. Image Processing

All images are scanned and converted into **WebP format** to improve page performance and reduce file sizes.

Benefits:

- Smaller file sizes
- Faster page load times
- Improved performance metrics

### 3. AWS S3 Upload

After conversion, images are uploaded to the AWS S3 bucket using the following path structure:

```
{repository_name}/pages/images
```

This allows multiple repositories to store assets in a single bucket while maintaining separation.

### 4. FTP Deployment

The workflow automatically uploads the required project files to the server using FTP, ensuring the latest version of the project is deployed.

## Benefits

- Automated deployment
- Consistent asset structure
- Automatic image optimization
- Faster website performance
- Reduced manual deployment steps

## Requirements

The workflow requires the following secrets configured in the repository settings:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

These credentials are used securely within GitHub Actions.

## Usage

1. Push changes to the repository
2. GitHub Actions runs the pipeline automatically
3. Images are optimized and uploaded
4. Project files are deployed via FTP

No manual deployment steps are required.

---

This setup provides a streamlined development and deployment workflow focused on **automation, performance, and consistency**.

