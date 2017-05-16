var jsontext = '[ \
  {\
    "idObj": "47688",\
    "trajetoria": [\
      {\
        "latitude": -22.95334833333333,\
        "longitude": -43.34953500000002,\
        "linha": "000",\
        "datahora": 1492030972000,\
        "velocidade": 0.1852\
      },\
      {\
        "latitude": -22.92378166666667,\
        "longitude": -43.37440999999999,\
        "linha": "810A1",\
        "datahora": 1493888079000,\
        "velocidade": 4.0744\
      }\
    ]\
  },\
  {\
    "idObj": "PKP008 -LUS4036",\
    "trajetoria": [\
      {\
        "latitude": -23.000673,\
        "longitude": -43.363658,\
        "linha": 0,\
        "datahora": 1492030039000,\
        "velocidade": 0\
      }\
    ]\
  },\
  {\
    "idObj": "86820",\
    "trajetoria": [\
      {\
        "latitude": -22.89506166666667,\
        "longitude": -43.53236166666667,\
        "linha": "5800A1",\
        "datahora": 1492029674000,\
        "velocidade": 0\
      }\
    ]\
  }\
]';
//console.log(jsontext)

var data = [];
var objeto = {};
var id ;
var idName;
var trajetorias = [];
var single_traj = {};
var campNames = [];
var endTraj = false;
var teste  = JSON.parse(jsontext, parseTest);
var endCampName = false;
//console.log(campNames);
function parseTest(key, value) {
	//console.log(key + " " +  value );
	if(id == undefined){
		id = value;
		idName = key;
		objeto[idName] = value;
	}else{
		if(key == "trajetoria"){
			endTraj= true;
		}else if(!(value instanceof  Object)){
				if(!endCampName)campNames.push(key);
				single_traj[key] = value;	
		}else{
			if(endTraj){
				endTraj = false;
				objeto['trajetoria'] = trajetorias;
				data.push(objeto);
				objeto = {};
				id = undefined;
				single_traj = {};
				trajetorias = [];
			}else{
				trajetorias.push(single_traj);
				single_traj = {};
				endCampName = true;
			}
		}
		//campNames.push(key);
	}
	

}
//console.log(data);
