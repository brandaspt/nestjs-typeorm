import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class BcryptAdapter {
  hashAsync(password: string): Promise<string> {
    return new Promise((res, rej) =>
      hash(password, 12, (err, hashed) => {
        if (err) rej(err);
        res(hashed);
      }),
    );
  }

  compareAsync(password: string, hashed: string): Promise<boolean> {
    return new Promise((res, rej) =>
      compare(password, hashed, (err, result) => {
        if (err) rej(err);
        res(result);
      }),
    );
  }
}
