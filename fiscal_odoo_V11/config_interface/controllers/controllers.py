# -*- coding: utf-8 -*-
from odoo import http

# class ConfigInterface(http.Controller):
#     @http.route('/config_interface/config_interface/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/config_interface/config_interface/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('config_interface.listing', {
#             'root': '/config_interface/config_interface',
#             'objects': http.request.env['config_interface.config_interface'].search([]),
#         })

#     @http.route('/config_interface/config_interface/objects/<model("config_interface.config_interface"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('config_interface.object', {
#             'object': obj
#         })