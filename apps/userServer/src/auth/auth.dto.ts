import { ApiProperty } from '@nestjs/swagger';

export class GitlabToken {
  access_token: string;
}

export class GetTokenByApplications {
  @ApiProperty({ example: 'iPzSxfuXv81JAU7EXr3bog' })
  code: string;
}

export class UserLoginDto {
  @ApiProperty({ example: 'cookieboty' })
  username: string;

  @ApiProperty({ example: '123456' })
  password: string;
}
