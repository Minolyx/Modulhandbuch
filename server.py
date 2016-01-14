# coding: utf-8

import os.path
import cherrypy

from app import studiengang, template

def main(): 

	try:
		currentDir_s = os.path.dirname(os.path.abspath(__file__))
	except:
		currentDir_s = os.path.dirname(os.path.abspath(sys.executable))
	cherrypy.Application.currentDir_s = currentDir_s

	configFileName_s = 'server.conf' # im aktuellen Verzeichnis   
	if os.path.exists(configFileName_s) == False:
	# Datei gibt es nicht
		configFileName_s = None

	cherrypy.engine.autoreload.unsubscribe()
	cherrypy.engine.timeout_monitor.unsubscribe()

	cherrypy.tree.mount(
		None, '/', configFileName_s
	)

	cherrypy.tree.mount(
		studiengang.Studiengang_cl(), '/studiengang', {'/': {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}}
	)

	cherrypy.tree.mount(
		template.Template_cl(), '/template', {'/': {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}}
	)
	
	cherrypy.config.update({
		'server.socket_host': '0.0.0.0', 
		'server.socket_port': 82, 
	}) 

	cherrypy.engine.start()
	cherrypy.engine.block()

if __name__ == '__main__':
	main()

