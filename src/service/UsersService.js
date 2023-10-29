export default class UsersService {
    constructor(manager) {
        this.manager = manager;
    }

    getUser = () => {
        return this.manager.getUser(params)
    }

    getUserBy = (params) => {
        return this.manager.getUserBy(params);

    }

    createUser = () => {
        return this.manager.createUser(user)
    }

    updateUser = () =>{
        return this.manager.updateUser(id, user);
    }

    deleteUser = () => {
        return this.manager.deleteUser(id)
    }
}