import cherrypy
from app import database

class Login_cl(object):
	exposed = True

	def __init__(self):
		self.db_o = database.Datenbank_cl()

	def GET(self):
		pass
