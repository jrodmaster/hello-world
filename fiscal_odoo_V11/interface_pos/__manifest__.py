# -*- coding: utf-8 -*-
{
    'name': "Interfaz Pos",

    'summary': """
    Permite la impresion de los documentos, por la impresora fiscal""",

    'description': """
       Impresion fiscal  por el punto de venta
    """,

    'author': "Neotec Group",
    'website': "http://www.neotec.do/",

    'category': 'Neotec/Pos',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','point_of_sale','ncf_pos','config_interface','protocol_message'],
    

    'qweb': ['static/src/xml/pos.xml'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
        'views/account_fiscal_position_view.xml'
    ],


}