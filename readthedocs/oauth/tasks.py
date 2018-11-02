# -*- coding: utf-8 -*-
"""Tasks for OAuth services."""

from __future__ import (
    absolute_import,
    division,
    print_function,
    unicode_literals,
)

from django.contrib.auth.models import User

from readthedocs.core.utils.tasks import PublicTask, user_id_matches
from readthedocs.worker import app

from .services import registry


@PublicTask.permission_check(user_id_matches)
@app.task(queue='web', base=PublicTask)
def sync_remote_repositories(user_id):
    user = User.objects.get(pk=user_id)
    for service_cls in registry:
        for service in service_cls.for_user(user):
            service.sync()
