import axios from 'axios';

const url = 'http://localhost:8080/api/';

class DatabaseService {
    static getProjectById(id){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'projects/' + id);
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }

    static getProjectsByMemberId(id){

    }

    static insertProject(name, isHackathon, endDate, endTime, description, git){
        return axios.post(url + 'projects/', {
            name: name,
            isHackathon: isHackathon,
            endDate: endDate,
            endTime: endTime,
            description: description,
            git: git
        });
    }

    static deleteProjectById(id){
        return axios.delete(url + 'projects/' + id);
    }
}

export default DatabaseService;