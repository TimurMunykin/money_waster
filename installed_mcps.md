  "mcp": {
    "servers": {
      "context7": {
        "command": "/Users/timur/.nvm/versions/node/v24.2.0/bin/npx",
        "args": [
          "-y",
          "@upstash/context7-mcp@latest"
        ]
      },
      "supabase": {
        "command": "npx",
        "args": [
          "-y",
          "@supabase/mcp-server-supabase@latest"
        ],
        "env": {
          "SUPABASE_ACCESS_TOKEN": "${input:supabase-access-token}"
        }
      }
    },
    "inputs": [
      {
        "type": "promptString",
        "id": "supabase-access-token",
        "description": "Supabase personal access token",
        "password": true
      }
    ]
  }