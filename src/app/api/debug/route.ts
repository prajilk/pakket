export async function GET() {
    return new Response(`Region: ${process.env.VERCEL_REGION}`);
}
