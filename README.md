# express-gateway-plugin-remote-login

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"username": "test","password": "test" }' 'http://localhost:8080/oauth2/token' -w %{time_total}