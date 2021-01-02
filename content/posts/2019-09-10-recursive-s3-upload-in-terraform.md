---
title: "recursive file upload to s3 in terraform"
date: 2019-09-10
draft: false
keywords:
    - terraform
    - aws s3
    - recursive upload
    - infrastructure as code
aliases:
    - /recursive-file-upload-to-s3-in-terraform/
---

I've been working a lot with [HashiCorp's](https://www.hashicorp.com/) 
[terraform](https://www.hashicorp.com/products/terraform) recently. From 
learning how to set up a [highly available container based infrastructure](https://learn.madetech.com/core-skills/infrastructure/)
using [AWS ECS](https://aws.amazon.com/ecs/), to setting up a 
[CloudFront](https://aws.amazon.com/cloudfront/) distribution for a static site 
hosted on [S3](https://aws.amazon.com/s3/).

One problem I have had to solve a number of times, is uploading the contents of
a directory recursively to an S3 bucket. With the help of a 
[post](https://andydote.co.uk/2017/04/23/s3-multi-file-upload-terraform/) from 
Andy Dote's blog, I was able to get some files uploaded. However I didn't like 
the idea of writing a .tf file from a bash script, so I wanted do this 
completely inside terraform.

## creating the S3 bucket
To begin with, we need an S3 bucket defined in our terraform project. The code
block below comes with a website block that sets up web hosting for the bucket.

```hcl
resource "aws_s3_bucket" "s3_static" {
  bucket  = "testing-website-static-hosting"
  acl     = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}
```

## uploading multiple files
Now we need get a set of files from a local directory containing the website
using the [fileset](https://www.terraform.io/docs/configuration/functions/fileset.html)
function.

We then feed that into the `for_each` to iterate over the set of files and
directories matched by the glob. We then continue much in the same way we did in
Andy's post, but leveraging the `each.value` property in place of the full
filename.

The mimetypes variable is used with the file extension taken from the file
path split on `.`.

```hcl
variable "upload_directory" {
  default = "${path.cwd}/codebases/website-static/"
}

variable "mime_types" {
  default = {
    htm   = "text/html"
    html  = "text/html"
    css   = "text/css"
    ttf   = "font/ttf"
    js    = "application/javascript"
    map   = "application/javascript"
    json  = "application/json"
  }
}

resource "aws_s3_bucket_object" "website_files" {
  for_each      = fileset(var.upload_directory, "**/*.*")
  bucket        = aws_s3_bucket.s3_static.bucket
  key           = replace(each.value, var.upload_directory, "")
  source        = "${var.upload_directory}${each.value}"
  acl           = "public-read"
  etag          = filemd5("${var.upload_directory}${each.value}")
  content_type  = lookup(local.mime_types, split(".", each.value)[length(split(".", each.value)) - 1])
}
```

## no caveats!
The caveat from Andy's post around deleting files that are no longer in the list
is not an issue any longer. If you remove a file from the folder and run 
terraform plan  you will see a deletion.

```shell script
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  aws_s3_bucket_object.website_files["test.html"] will be destroyed
```

Hopefully this will help those who are using terraform to host a site in S3.
I've been using this to build a maintenance holding page for emergency
situations where the main application is down.
