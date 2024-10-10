# Eppo's Contentful Blog Sample (Pages Router)

Integrates Eppo with [Contentful's Next.JS Blog Starter Template (pages-router version)](https://github.com/contentful/template-blog-webapp-nextjs/tree/bc28265). Use the changes in this repository to help guide your own integration with Eppo's Contentful marketplace app.

Before applying changes to your codebase, follow [this guide](https://docs.geteppo.com/guides/marketing/integrating-with-contentful/) to install Eppo's Contentful marketplace app and configure the app for your Contentful space.

The example in this codebase shows how we can display variations of a "Hero image" for a blog post. This assumes that you have an `eppoExperiment` field attached to every `page - Blog post` content type, and that you are allowing `component - Rich image` to be assigned as variations for your experiment. Follow [this guide](https://docs.geteppo.com/guides/marketing/integrating-with-contentful/) to configure your Contentful space.

## Integration Instructions

These instructions assume your codebase started with [Contentful's Next.JS Blog Starter Template (pages-router version)](https://github.com/contentful/template-blog-webapp-nextjs/tree/bc28265)

### Install and configure Eppo's Node SDK

1. Run `yarn add @eppo/node-server-sdk@3.4.0` to add or upgrade `@eppo/node-server-sdk`. The version must be at least `3.4.0`.
1. Create or update your `.env` file to include `EPPO_SDK_KEY`, along with any other necessary environment variables defined in the [.env.example](https://github.com/Eppo-exp/contentful-pages-router-blog-sample/blob/main/.env.example).

### Update GraphQL schema and generate new types

1. Create an `EppoExperimentFields` GraphQL fragment. See [src/lib/graphql/eppoExperimentFields.graphql](https://github.com/Eppo-exp/contentful-pages-router-blog-sample/blob/main/src/lib/graphql/eppoExperimentFields.graphql).
1. Update your `pageBlogPost` query to include a new `PageBlogPostWithExperimentFields` fragment. See `src/lib/graphql/pageBlogPost.graphql` in [this changeset](https://github.com/Eppo-exp/contentful-pages-router-blog-sample/commit/ada8d5e).
1. Run `yarn graphql-codegen:generate` to generate your models.

### Update your codebase to support experiments

1. Create a new "Eppo Client" helper to easily integrate with Eppo. See [src/pages/utils/eppo-client.ts](https://github.com/Eppo-exp/contentful-pages-router-blog-sample/blob/main/src/pages/utils/eppo-client.ts).
1. Update your blog page with the code needed to override the "hero image" of a blog post. See `src/pages/[slug].page.tsx` in [this changeset](https://github.com/Eppo-exp/contentful-pages-router-blog-sample/commit/ada8d5e). Make sure that `getStaticPaths` is changed to `getServerSideProps`.

### Test out your changes

Run `yarn dev` to test out your changes!
