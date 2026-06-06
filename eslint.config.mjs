import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**', 'data/**', 'raw/**'],
  },
];

export default eslintConfig;
