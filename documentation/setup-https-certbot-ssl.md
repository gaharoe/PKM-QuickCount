# HOW TO SETUP CERBOT SSL TO MAKE HTTPS

## 1. NGINX REVERSE PROXY TO USE PORT 80


install dependencies

```bash
sudo apt update
sudo apt install nginx -y
```


nginx reverse proxy configuration

```bash
cd /etc/nginx/sites-available/
nano yourdomain.com
```


paste inside "yourdomain.com" file

```bash
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:{port};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

activate config

```bash
# symlink
sudo ln -s /etc/nginx/sites-available/domainlu.com /etc/nginx/sites-enabled/

# delete nginx default configuration
sudo rm /etc/nginx/sites-enabled/default

# restart nginx
sudo systemctl restart nginx
```






## 2. CERTBOT SSL SETUP HTTPS

install dependencies 

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

```bash
sudo certbot --nginx
```

