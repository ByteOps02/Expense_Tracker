To fix the CORS error, you need to update the `CLIENT_URL` environment variable in your Vercel deployment settings for the backend.

Set the `CLIENT_URL` environment variable to:
`http://localhost:5173,https://expense-tracker-52hv.vercel.app`

This will allow both your local development environment and your Vercel frontend to make requests to the backend.