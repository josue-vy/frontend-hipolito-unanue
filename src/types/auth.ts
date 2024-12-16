export interface Usuario {
    correo: string;
    contrasena: string;
    token: string;
  }
  
  export interface LoginRespuesta {
    token: string;
  }
  
  export interface DecodedToken {
    id: string;
    rol: string;
  }
  