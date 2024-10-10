# Eppo's Contentful Blog Sample (Pages Router)

Integrates Eppo with [Contentful's Next.JS Blog Starter Template (pages-router version)](https://github.com/contentful/template-blog-webapp-nextjs/tree/bc28265). Use the changes in this repository to help guide your own integration with Eppo's Contentful marketplace app.

Before applying changes to your codebase, follow [this guide](https://docs.geteppo.com/guides/marketing/integrating-with-contentful/) to install Eppo's Contentful marketplace app and configure the app for you Contentful space.

This codebase demonstrates how we can display variations of a "Hero image" for a blog post. This assumes that you have an `eppoExperiment` field attached to every `page - Blog post` content type, and that you are allowing `component - Rich image` to be assigned as variations for your experiment. Follow [this guide](https://docs.geteppo.com/guides/marketing/integrating-with-contentful/) to configure your Contentful space.
