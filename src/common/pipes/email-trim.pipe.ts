// @Injectable()
// export class EmailTrimPipe implements PipeTransform {
//   private readonly emailFields = ['email', 'userEmail', 'contactEmail'];

//   transform(value: any) {
//     if (typeof value === 'object' && value !== null) {
//       return this.trimObjectEmails(value);
//     }
//     return value;
//   }

//   private trimObjectEmails(obj: any): any {
//     const trimmed: any = {};

//     for (const [key, value] of Object.entries(obj)) {
//       if (this.emailFields.includes(key) && typeof value === 'string') {
//         trimmed[key] = this.trimEmail(value);
//       } else {
//         trimmed[key] = value;
//       }
//     }

//     return trimmed;
//   }
// }
