import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IAService {
  private http = inject(HttpClient);
  private apiKey = 'AIzaSyDJ0I-O53GJgXMZojZX7uCF5q33i9hHpvs';
  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;

  constructor() { }

  async getResponse(prompt:string) : Promise<string>{
    //{'traduccion':'hola'}
    const body = {
      contents: [{
        parts : [{text: prompt}]
      }],
      generationConfig : {
        responseMimeType : 'application/json',
        responseSchema : {
          type : 'OBJECT',
          properties : {
              traduccion : {"type" : "STRING"},
            }
          }
        }
    };

    try{
      const response: any = await firstValueFrom(
        this.http.post(this.apiUrl, body)
      );

      console.log('Respuesta completa de Gemini:', response);
      return response.candidates[0]?.content?.parts?.[0]?.text || 'No hubo respuesta';
    }catch(error){
      console.log('Error en la IA:', error);
      return 'Error al obtener respuesta de la IA';
    }
  }
}
