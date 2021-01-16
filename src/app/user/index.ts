import WS from '../ws'

class UserService {
    async info() {
        const payload = {
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetUserInfo",
            o: payload
        }

        const res = await WS.send(request)
        return res
    }
    async permissions() {
        const payload = {
        };

        const request = {
            m: 0,		//MessageType ( 0_Request / 1_Reply / 2_Subscribe / 3_Event / 4_Unsubscribe / Error )
            i: 0,		//Sequence Number
            n: "GetAvailablePermissionList",
            o: JSON.stringify(payload)

        }

        const res = await WS.send(request)
        return res
    }
}

export default new UserService()