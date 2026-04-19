import os
import django
from django.contrib.auth import get_user_model

# Настройка окружения Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

def create_admin():
    User = get_user_model()
    username = 'pcbuild'
    password = 'pcbuild1'
    email = 'admin@example.com'

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
        print(f"Суперпользователь '{username}' успешно создан.")
    else:
        user = User.objects.get(username=username)
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        print(f"Пароль суперпользователя '{username}' обновлен.")

if __name__ == '__main__':
    create_admin()
