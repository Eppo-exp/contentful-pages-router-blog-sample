import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';

import { getServerSideTranslations } from './utils/get-serverside-translations';

import { ArticleContent, ArticleHero, ArticleTileGrid } from '@src/components/features/article';
import { SeoFields } from '@src/components/features/seo';
import { Container } from '@src/components/shared/container';
import { PageBlogPostFieldsFragment, RichImageFieldsFragment } from '@src/lib/__generated/sdk';
import { client, previewClient } from '@src/lib/client';
import { selectExperimentEntry } from '@src/pages/utils/eppo-client';

type Props = {
  blogPost: PageBlogPostFieldsFragment;
  selectedVariationEntry: RichImageFieldsFragment | null;
  isFeatured: boolean;
};

const Page = (props: Props) => {
  const { t } = useTranslation();
  const blogPost = useContentfulLiveUpdates(props.blogPost);
  const relatedPosts = blogPost?.relatedBlogPostsCollection?.items;

  if (!blogPost || !relatedPosts) {
    return null;
  }

  return (
    <>
      {blogPost?.seoFields && <SeoFields {...blogPost.seoFields} />}
      <Container>
        <ArticleHero article={blogPost} isFeatured={props.isFeatured} isReversedLayout={true} />
      </Container>
      <Container className="mt-8 max-w-4xl">{<ArticleContent article={blogPost} />}</Container>
      {relatedPosts && (
        <Container className="mt-8 max-w-5xl">
          <h2 className="mb-4 md:mb-6">{t('article.relatedArticles')}</h2>
          <ArticleTileGrid className="md:grid-cols-2" articles={relatedPosts} />
        </Container>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, locale, preview }) => {
  if (!params?.slug || !locale) {
    return {
      notFound: true,
    };
  }

  const gqlClient = preview ? previewClient : client;

  try {
    const [blogPageData, landingPageData] = await Promise.all([
      gqlClient.pageBlogPost({ slug: params.slug.toString(), locale, preview }),
      gqlClient.pageLanding({ locale, preview }),
    ]);

    const blogPost = blogPageData.pageBlogPostCollection?.items[0];
    const landingPage = landingPageData.pageLandingCollection?.items[0];

    if (!blogPost) {
      return {
        notFound: true,
      };
    }

    const isFeatured = landingPage?.featuredBlogPost?.slug === blogPost?.slug;

    // TODO: This can be anything, using Math.random() just for illustration
    const subjectKey = Math.random().toString();
    const eppoExperiment = blogPost.eppoExperiment;
    const featuredImageVariation =
      (await selectExperimentEntry<RichImageFieldsFragment>(eppoExperiment, subjectKey)) ?? null;

    const blogPostWithExperiment: PageBlogPostFieldsFragment = {
      ...blogPost,
      featuredImage: featuredImageVariation?.image ?? blogPost.featuredImage,
    };

    return {
      props: {
        ...(await getServerSideTranslations(locale)),
        previewActive: !!preview,
        blogPost: blogPostWithExperiment,
        isFeatured,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};

export default Page;
