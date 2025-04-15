// This file sets environment variables before Next.js runs
process.env.NEXT_PUBLIC_IS_ELECTRON = process.argv.includes('--electron') ? 'true' : 'false';