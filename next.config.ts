import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl({
  images: {
	domains: ['cp.haliotis.space'],
  },
});