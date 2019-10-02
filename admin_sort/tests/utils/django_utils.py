from django.contrib.auth.models import User


def create_superuser():
    superuser = User.objects.create_superuser('admin',
                                              'admin@free.fr',
                                              'secret')
    return superuser
