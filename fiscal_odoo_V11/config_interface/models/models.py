# -*- coding: utf-8 -*-

from odoo import models, fields, api

import logging
_logger = logging.getLogger(__name__)

class ConfigInterface(models.Model):
    _name = 'config.interface'

    name = fields.Char(string="Nombre")

    @api.model
    def get_config(self, config_interface_id=None):
        """
        function get config...
        :return: dict
        """
        res = {}
        config_id = self.browse(config_interface_id) if config_interface_id else self
        for key in config_id.fields_get_keys():
            res[key] = config_id.browse(arg=config_id.id)[key]

        return res
