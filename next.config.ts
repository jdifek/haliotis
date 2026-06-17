import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl({
  images: {
    domains: [process.env.NEXT_PUBLIC_API_DOMAIN || 'cp.haliotis.space'],
    qualities: [100, 75],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});