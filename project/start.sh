#!/bin/bash

while ! nc -z db 3306 ; do
    echo "Waiting for the MySQL Server"
    sleep 3
done

python manage.py collectstatic --noinput&&
python manage.py makemigrations&&
python manage.py migrate&&
gunicorn project.wsgi:application -b 0.0.0.0:8000
tail -f /dev/null

exec "$@"
