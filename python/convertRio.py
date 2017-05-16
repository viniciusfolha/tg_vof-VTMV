import json

novo = []
with open('RIO_BRT_ALL.txt') as infile:
	jsondata = json.load(infile)
	for idx,veiculo in enumerate(jsondata["veiculos"]):
		aux = [idx_novo for idx_novo,item in enumerate(novo) if item['idObj'] == veiculo["codigo"]]
		if(aux == []):
			obj = {}
			traj = {}
			traj['latitude'] = veiculo["latitude"];
			traj['longitude'] = veiculo["longitude"];
			traj['linha'] = veiculo["linha"];
			traj['datahora'] = veiculo["datahora"];
			traj['velocidade'] = veiculo["velocidade"];

			obj['idObj'] = veiculo["codigo"];
			obj['trajetoria'] = [];
			obj['trajetoria'].append(traj);
			novo.append(obj);
		else:
			traj = {}
			traj['latitude'] = veiculo["latitude"];
			traj['longitude'] = veiculo["longitude"];
			traj['linha'] = veiculo["linha"];
			traj['datahora'] = veiculo["datahora"];
			traj['velocidade'] = veiculo["velocidade"];
			novo[aux[0]]['trajetoria'].append(traj);

with open('RIO_BRT_ALL_CONVERTED.txt', 'w') as outfile:
	json.dump(novo, outfile,ensure_ascii=True)