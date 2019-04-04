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

    static getStoriesByMemberId(id){

    }

    static getStoryById(id){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'stories/' + id);
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }

    static updateStory(id, json){
        return axios.put(url + 'stories/' + id, json);
    }

    static getStoryMember(pid, id){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'projects/' + pid + '/members/');
                let data = null;
                res.forEach(member => {
                    if (member._id == id){
                        data = member;
                        resolve(data);
                    }
                });
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }

    static getSprintById(id){
        
    }
}

export default DatabaseService;