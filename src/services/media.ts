import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, cloudStorage } from './firebase';

const localDataUrl=(file:File)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file)});

export async function uploadPrivateImage(file:File,area:'routines'|'classes',id:string):Promise<string>{
  if(!file.type.startsWith('image/'))throw new Error('Choose an image file.');
  if(file.size>5*1024*1024)throw new Error('Images must be 5 MB or smaller.');
  const user=auth?.currentUser;
  if(!cloudStorage||!user)return localDataUrl(file);
  const extension=file.name.split('.').pop()?.replace(/[^a-z0-9]/gi,'').toLowerCase()||'jpg';
  const target=ref(cloudStorage,`users/${user.uid}/${area}/${id}.${extension}`);
  await uploadBytes(target,file,{contentType:file.type});
  return getDownloadURL(target);
}
