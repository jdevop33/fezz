# Firebase Service Account

This is the service account JSON that should be used for GitHub Actions.

1. Go to your GitHub repository > Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Name: `FIREBASE_SERVICE_ACCOUNT`
4. Value: Paste the following JSON

```json
{
  "type": "service_account",
  "project_id": "fezz-452821",
  "private_key_id": "443c65be18e4573c9d74c5536b9479fafc3888de",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDaRKV98IJas7Lj\n8qth+WAFVJcJdKacex3ur4JEQCW0YzxFw1SyY0wPaM3oxHA3aAcqrVb9CCPSOAO4\nOraKoZ4WDyOizsMRZdV/SDG6TyYFaWnM+3Slld8OR6OD0I1udGQeM8tFcIHYY42L\nHOm9vB7aWeiMAPUW+k1BvwiyTcnC/cWE/XltgcjNX8bqbUDvkjgGT4aIebe6AkJR\na5pERaVLPJLhZE8nmqrCXkQthhuLWBN0i7l2qRXUvLjkGA2u1pOlGt7fuXqMsrj+\nObUZeKTpE69r8BRreOiB1s22qdGKYH/bvUiVZ2TYaS0rhW5TOt0B/q8k2TkEfp9R\nTnfOMEErAgMBAAECggEAazQ+SG4hyGTsn3MoZDW0yMl0aauGzeLWn85KYDVVj5US\nHH3FEt0clZD3WbVqHHyW0IpU6HDgDzd99DW6RLr+x3zmFugQ/XGT/DE8Y3LOjOfq\nlEiJUW8cIIplMK/1V2QJbKAp3dBVpi+3bLVlxNAqIzr3shQiTQfhfEJVBiaYy5Eq\nYvb1QWtjlbJiX1dDoKXQZa4nMSOO6XE09s2YSItHtW3Ohb4C8giYk+SIEfdE515C\naChczKvODcuz87LLxXwHmYQyGrXT8U1/eGkfAfPbxEHp2PGLCgZYWlVdfrSRMLsl\n448E6xyJtCEssYpiNMrcaIAnPzvclYNnkSwLYHA6CQKBgQD+muulAc1iL3sKb2fQ\n50aUOVS7NMeDQyVzuIBYOfxN7JSVt9Nn++4HWzLftxkjxG+nzAH5QtqIIVAyKSK0\ndKazovvZ/MqTlznJ/IU3AZmLjMQunJ7Y/6eOBIMIFAEA1PY+MgUkq3tN0iuRbqr1\n3oQCtYqiHPXgwPstiPOBGHs63QKBgQDbdsOP8TDt57Ccjy1WlVrUa+yrsgdpzBwu\ndIFtJPz/h+eKvOAuZ8+UO5H0eNk/152r/LDfQC9WCnKo+xXtqQ3Fk3bhEyEMfPj6\nqqFvC6gdM3NQl33totNpCceqNnlSFAN9kUfGr/T5lbz0IUJ/hlZvw9TtwaVkY5yp\nsh8rId8XpwKBgQC1GE5aLMEAgJM85ebq8UYDcg/xpGXw2JbQC8DGgGAUsR0yrPEi\n+k/hTZ4PADZSeYuNx47z0/iKcV+Qfi/gOUTFaz1GXQdeGWeSYxoB+RJU70gve1mF\nMbrlShJFca0RAWkw7fU4kvx+aupwZE4X2jD9mFFGY+ED/1/pkIrbHSWxxQKBgEBR\nizj5X/SpbWpEz+3LMeaFhsQ/Fcsc5bl7rZ7WM0uUgfh4KF+RTxXLa5gxfsImJ/CK\nyy9yuSzHPRlnFOMlI4MfF70ZBRuK2NFmBo/r46ZDOO2KqH5ntPvYwOqSsnWqpec8\nF8QUN4CaMNl/keSb82MoCpRvp1BHnVdie54BfEeLAoGBAKwVO19NrBIpVcpEL0fB\nayNDrMEGJsTkwPU9g8tv+0Y1QPmRjYmQIqptFMH5hWYqrtYjpsgtnN4bBJxFA2Wx\nHoRqnHeS1xgezuRpH1ailzU7f7hHmJ7xEN7ZA15O+3VSuUcMv2cyhOnKOxj6Ob8Z\nXH2MDREx1g24xwqL3zTFn1Gv\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@fezz-452821.iam.gserviceaccount.com",
  "client_id": "103066466695760000498",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40fezz-452821.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

5. Click "Add secret"

## Security Note

This file contains sensitive information and should be added to your .gitignore file before committing to your repository. It's stored here temporarily for convenience.