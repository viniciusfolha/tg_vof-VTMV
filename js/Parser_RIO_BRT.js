class Parser_RIO_BRT{
	
	constructor(url) {
		this.url = url;
		this.dados = [];
	}

	doSomethingWithData(jsondata) {
      console.log(jsondata);
      console.log(jsondata.veiculos);
      var novo = [];
      for(var idx in jsondata.veiculos){
	      	var t = novo.findIndex(x => x.idObj === jsondata.veiculos[idx].codigo);
	      	
	      	if(t == '-1'){
	      		
	      		var aux = {}; 
	      		var traj = {}
	      		
	      		traj['latitude'] = jsondata.veiculos[idx].latitude;
	      		traj['longitude'] = jsondata.veiculos[idx].longitude;
	      		traj['linha'] = jsondata.veiculos[idx].linha;
	      		traj['datahora'] = jsondata.veiculos[idx].datahora;
	      		traj['velocidade'] = jsondata.veiculos[idx].velocidade;	

	      		aux['idObj'] = jsondata.veiculos[idx].codigo;
	      		aux['trajetoria'] = [];
	      		
	      		aux['trajetoria'].push(traj);
	      		novo.push(aux);
      		}else{
      			var traj = {}
      			
      			traj['latitude'] = jsondata.veiculos[idx].latitude;
	      		traj['longitude'] = jsondata.veiculos[idx].longitude;
	      		traj['linha'] = jsondata.veiculos[idx].linha;
	      		traj['datahora'] = jsondata.veiculos[idx].datahora;
	      		traj['velocidade'] = jsondata.veiculos[idx].velocidade;	
	      		novo[t]['trajetoria'].push(traj);

      		}
	      	//console.log(jsondata.veiculos[idx].codigo);
	      	//var filteredData = jsondata.veiculos.filter(d => d.codigo === jsondata.veiculos[idx].codigo);
	      	//console.log(filteredData);
      	
      	}
      	console.log('test');
      	var str =JSON.stringify(novo, null, 2);
      	console.log(str);
	}

	data(){
	d3.json(this.url, this.doSomethingWithData);
	}


}

