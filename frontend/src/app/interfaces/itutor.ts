export interface Itutor {
    id: number;
    name: string;
    password: string;
    email: string;
    phone: number;
    qualification_id: number;
    experience_id: number;
    address: string;
    image: string;
    qualification: {
        id:number;
        level:string
    };
    experience: {
        id:number;
        category:string
    }
}
