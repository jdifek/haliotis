import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl({
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cp.haliotis.website' },
      { protocol: 'https', hostname: 'cp.haliotis.space' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
