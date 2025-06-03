import {id} from "date-fns/locale";

let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
let nextConfig = {
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
    }

    const idRedirects = Object.entries(customRedirects).map(([id, destination]) => ({
      source: `/viewdoctors/${id}`,
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

// Merge before exporting
nextConfig = mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return nextConfig;

  const merged = { ...nextConfig };

  for (const key in userConfig) {
    if (
        typeof merged[key] === 'object' &&
        !Array.isArray(merged[key]) &&
        typeof userConfig[key] === 'object'
    ) {
      merged[key] = {
        ...merged[key],
        ...userConfig[key],
      };
    } else {
      merged[key] = userConfig[key];
    }
  }

  return merged;
}

export default nextConfig;
