# coding: utf-8

import os
import os.path
import codecs
import json
from operator import itemgetter

class Database_cl(object):
	def __init__(self):
		self.data_o = {}
		self.readData_p()

	def create_px(self, data_opl):
		id_s = self.nextId_p()
      # Datei erzeugen
		path = "./data/studiengang.json"
		data_opl['id'] = id_s

		with open(path, 'r') as pathfile:
			content = json.load(pathfile)
		content.append(data_opl)

		with open(path, 'w') as pathfile:
			json.dumps(content, pathfile)


		self.data_o[id_s] = data_opl

		return id_s

	def read_px(self, id_spl = None):
		data_o = None
		if id_spl == None:
			data_o = self.data_o
		elif id_spl == '0':
			data_o = self.getDefault_px()
		else:
			if id_spl in self.data_o:
				data_o = self.data_o[id_spl]

		return data_o

	#update
	#delete
	def getDefault_px(self):

		return {
			'studiengang': '',
			'kurzBezeichnung': '',
			'semesterAnzahl': ''
		}

	def readData_p(self):
		filePath = "./data/studiengang.json"

		with open(filePath, "r") as content:
			majors = json.load(content)

		majors = sorted(majors, key=itemgetter('studiengang'))

		for entry in majors:
			id_s = entry["id"]
			self.data_o[id_s] = entry


	def nextId_p(self):
		filePath = "./data/studiengang.json"
		studiengangID = 0
		with open(filePath, "r") as content:
			majors = json.load(content)

			for entry in majors:
				studiengangID = studiengangID + 1
		return studiengangID.toString()
# EOF
