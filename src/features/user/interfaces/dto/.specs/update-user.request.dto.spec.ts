import { validate } from 'class-validator';
import { UpdateUserRequestDto } from '../update-user.request.dto';

describe('UpdateUserRequestDto', () => {
  describe('validation', () => {
    it('should pass validation with valid username', async () => {
      const dto = new UpdateUserRequestDto();
      dto.username = 'validuser';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when username is empty', async () => {
      const dto = new UpdateUserRequestDto();
      dto.username = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('username');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when username is too short', async () => {
      const dto = new UpdateUserRequestDto();
      dto.username = 'ab';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('username');
      expect(errors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when username is too long', async () => {
      const dto = new UpdateUserRequestDto();
      dto.username = 'a'.repeat(21);

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('username');
      expect(errors[0].constraints).toHaveProperty('isLength');
    });

    it('should fail validation when username is not a string', async () => {
      const dto = new UpdateUserRequestDto();
      (dto as any).username = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('username');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should pass validation with minimum length username', async () => {
      const dto = new UpdateUserRequestDto();
      dto.username = 'abc';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with maximum length username', async () => {
      const dto = new UpdateUserRequestDto();
      dto.username = 'a'.repeat(20);

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
