import axios from 'axios';

const url = 'api/';

class DatabaseService {
    static getProjectsByMemberId(id){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'projects/members/' + id);
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }

    static getProjectsFromUser(){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'projects/');
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }


    

    static insertProject(properties){
        
        return axios.post(url + 'projects/', {
            name: properties.name,
            projectType: properties.projectType,
            endDate: properties.endDate,
            endTime: properties.endTime,
            description: properties.description,
            hackathonName: properties.hackathonName,
            git: properties.git,
            members: properties.members,
            owners: properties.members
        });
    }

    static insertStory(properties){
        
        return axios.post(url + 'stories', {
            title: properties.title,
            status: properties.status,
            sprint: properties.sprint,
            estimatedTime: properties.estimatedTime,
            description: properties.description,
            member: properties.member,
            priority: properties.priority,
            project: properties.project
        });
    }
   

    static deleteProjectById(id){
        return axios.delete(url + 'projects/' + id);
    }

    static getStoriesByMemberId(id){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'members/' + id + '/stories/');
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
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

    static updateSprint(id, json){
        return axios.put(url + 'sprints/' + id, json);
    }

    static getCurrentUserId(){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'members/');
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }


    static getMembersinProject(pid){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'projects/' + pid + '/members/');
                let data = null;
                res.forEach(member => {
                        data = member;
                        resolve(data);
                });
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }

    static getSprintById(id){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'sprints/' + id);
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }

    static getMemberInfo(pid, firstname, lastname){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'members/' + pid + 
                "/"+lastname+"/"+firstname);
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });


    }

    static getSprints(pid){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'projects/' + pid + '/sprints');
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }
    static getMemberNames(pid){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'projects/' + pid + '/membernames');
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    }

    static insertSprint(properties){
        
        return axios.post(url + 'sprints', {
            duration: properties.duration,
            project: properties.project
        });
    }

    static addMember(properties){
        
        return axios.post(url + 'projects/add_member', {
            project: properties.project,
            email: properties.email

        });
    }

    static getMember(){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url + 'members/info');
                const data = res.data;
                resolve(data);
            }catch(err){
                reject(err);
            }
        });
    
    }
    static deleteStory(id){
        return axios.delete(url + 'stories/' + id);
    }
    static deleteSprint(id){
        return axios.delete(url + 'sprints/' + id);
    }
    static removeMember(pid, id){
        
        return axios.delete(url + 'projects/' + pid + '/members/'+ id );
    }

}

export default DatabaseService;