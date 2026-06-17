import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const backendDomain = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || 'cp.haliotis.space';

export default withNextIntl({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: backendDomain,
      },
    ],
    qualities: [100, 75],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});