/** @type {import('next').NextConfig} */
const baseConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async redirects() {
    const customRedirects = {
      '199': '/doctors/4d4hkJFfmfvqIHGHPySj',
      '178': '/doctors/VsKCMyxF6j3dyQVE19pI',
      '166': '/doctors/0tq19j8rbLchS2NR2mH9',
    };

    const idRedirects = Object.entries(customRedirects).map(([id, destination]) => ({
      source: `/viewdoctor/${id}`,
      destination,
      permanent: true,
    }));

    return [
      ...idRedirects,
      {
        source: '/viewdoctor/:id',
        destination: '/',
        permanent: true,
      },
      {
        source: '/searchdoctor',
        destination: '/',
        permanent: true,
      },
      {
        source: '/viewspecialist',
        destination: '/specialist',
        permanent: true,
      },
      {
        source: '/doctorlogin',
        destination: '/tool',
        permanent: true,
      },
      {
        source: '/patientlogin',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

// ✅ Clean export (no Promise)
module.exports = baseConfig;
