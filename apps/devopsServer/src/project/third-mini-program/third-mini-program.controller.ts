import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThirdMiniProgramService } from '@devopsServer/project/third-mini-program/third-mini-program.service';
import { BusinessException, Public } from '@app/common';
import { IterationService } from '@devopsServer/iteration/iteration.service';
import {
  ThirdMiniProgramListDto,
  ThirdMiniProgramUpdateDto,
  commitCodeDto,
} from './third-mini-program.dto';

import * as WeChatApi from '@devopsServer/helper/weChat';

import { IThirdMiniProgramStatus } from './third-mini-program.entity';

const process = require('child_process');

@ApiTags('第三方小程序')
@Controller('third-mini-program')
export class ThirdMiniProgramController {
  constructor(
    private readonly thirdMiniProgramService: ThirdMiniProgramService,
    private readonly iterationService: IterationService,
  ) { }
  @ApiOperation({
    summary: '获取第三方小程序列表',
  })
  @Post('getList')
  async getList(@Body() listDto: ThirdMiniProgramListDto) {
    const { projectId, environment } = listDto;
    const result = await this.thirdMiniProgramService.findByProjectId({
      projectId,
      environment,
    });
    return result;
  }

  @ApiOperation({
    summary: '添加第三方小程序自定义配置',
  })
  @Post('updateConfig')
  async updateConfig(@Body() updateDto: ThirdMiniProgramUpdateDto) {
    const { id, cusConfig, projectId, environment } = updateDto;
    const result = await this.thirdMiniProgramService.findOne({
      id,
      projectId,
      environment,
    });
    return await this.thirdMiniProgramService.createOrUpdate({
      ...result,
      cusConfig: JSON.stringify(cusConfig),
    });
  }

  getReThirdMiniPrograms = async (commitCodeParams) => {
    const { thirdMiniProgramIds, componentAppId, projectId, environment } =
      commitCodeParams;
    const authorizerList: any = await WeChatApi.getAuthorizerList({
      component_access_token: '1',
      component_appid: componentAppId,
      offset: 0,
      count: 500,
    });
    console.log('authorizerList==', authorizerList);
    const thirdMiniPrograms: any = await this.thirdMiniProgramService.findByIds(
      thirdMiniProgramIds,
      projectId,
      environment,
    );
    console.log('thirdMiniPrograms==', thirdMiniPrograms);

    const reThirdMiniPrograms = thirdMiniPrograms.map((thirdMiniProgram) => {
      let { bizConfig }: any = thirdMiniProgram;
      bizConfig = JSON.parse(bizConfig);
      console.log(bizConfig);
      const exit = authorizerList.list.filter(
        (auth) => auth.authorizer_appid == bizConfig.attr.wxAppid,
      );
      console.log(exit);
      if (exit[0]) {
        return {
          ...thirdMiniProgram,
          refresh_token: exit[0].refresh_token,
        };
      } else {
        throw new BusinessException('无匹配商户');
      }
    });

    for (const thirdMiniProgram of reThirdMiniPrograms) {
      console.log('thirdMiniProgram===>', thirdMiniProgram);
      const { refresh_token }: any = thirdMiniProgram;
      let { bizConfig }: any = thirdMiniProgram;
      bizConfig = JSON.parse(bizConfig);
      const token: any = await WeChatApi.getApiAuthorizerToken({
        component_access_token: 's',
        component_appid: componentAppId,
        authorizer_appid: bizConfig.attr.wxAppid,
        authorizer_refresh_token: refresh_token,
      });
      thirdMiniProgram.token = token;
    }

    return reThirdMiniPrograms;
  };

  @ApiOperation({
    summary: '第三方小程序上传代码',
  })
  @Post('commitCode')
  @Public()
  async commitCode(@Body() commitCodeParams: commitCodeDto) {
    const reThirdMiniPrograms =
      await this.getReThirdMiniPrograms(commitCodeParams);
    for (const thirdMiniProgram of reThirdMiniPrograms) {
      const iteration = await this.iterationService.findIterationByVersion(
        thirdMiniProgram.projectId,
        thirdMiniProgram.currentVersion,
      );
      const iterationName = iteration?.name;
      const token: any = thirdMiniProgram.token;
      const callback: any = await WeChatApi.codeCommit({
        access_token: token.authorizer_access_token,
        template_id: thirdMiniProgram.templateId,
        ext_json: thirdMiniProgram.extJson,
        user_version: thirdMiniProgram.currentVersion,
        user_desc: commitCodeParams.desc || iterationName,
      });

      if (callback.errmsg === 'ok') {
        await WeChatApi.getQrcode(
          thirdMiniProgram.token.authorizer_access_token,
          thirdMiniProgram.id,
        );
        this.thirdMiniProgramService.createOrUpdate({
          ...thirdMiniProgram,
          status: IThirdMiniProgramStatus.publishSuccess,
          qrCodeUrl: `http://dev.static/${thirdMiniProgram.id}.jpg`,
        });
      } else {
        this.thirdMiniProgramService.createOrUpdate({
          ...thirdMiniProgram,
          status: IThirdMiniProgramStatus.publishFail,
          errmsg: callback.errmsg,
          errcode: callback.errcode,
        });
      }
    }
    return reThirdMiniPrograms;
  }

  @ApiOperation({
    summary: '发布小程序',
  })
  @Post('release')
  @Public()
  async release(@Body() commitCodeParams: commitCodeDto) {
    const reThirdMiniPrograms =
      await this.getReThirdMiniPrograms(commitCodeParams);
    const recordList: any = [];
    for (const thirdMiniProgram of reThirdMiniPrograms) {
      let record: any = {};
      const token: any = thirdMiniProgram.token;
      const callback: any = await WeChatApi.release(
        token.authorizer_access_token,
      );

      record = {
        sellerId: thirdMiniProgram.id,
        appId: commitCodeParams.componentAppId,
        extJson: thirdMiniProgram.extJson,
        version: thirdMiniProgram.currentVersion,
        templateId: thirdMiniProgram.templateId,
      };

      if (callback.errmsg === 'ok') {
        this.thirdMiniProgramService.createOrUpdate({
          ...thirdMiniProgram,
          status: IThirdMiniProgramStatus.release,
          lastVersion: thirdMiniProgram.currentVersion,
        });
        record.status = 3;
      } else {
        this.thirdMiniProgramService.createOrUpdate({
          ...thirdMiniProgram,
          status: IThirdMiniProgramStatus.auditFail,
          errmsg: callback.errmsg,
          errcode: callback.errcode,
        });
        record.status = 4;
        record.failReason = callback.errcode;
      }
      recordList.push(record);
    }
    console.log('recordList===>', recordList);
    return reThirdMiniPrograms;
  }

  @ApiOperation({
    summary: '提交审核',
  })
  @Post('undocodeaudit')
  @Public()
  async undocodeaudit(@Body() commitCodeParams: commitCodeDto) {
    const reThirdMiniPrograms =
      await this.getReThirdMiniPrograms(commitCodeParams);
    for (const thirdMiniProgram of reThirdMiniPrograms) {
      const token: any = thirdMiniProgram.token;
      const callback: any = await WeChatApi.undocodeaudit(
        token.authorizer_access_token,
      );
      if (callback.errmsg === 'ok') {
        this.thirdMiniProgramService.createOrUpdate({
          ...thirdMiniProgram,
          status: IThirdMiniProgramStatus.waitPublish,
        });
      } else {
        this.thirdMiniProgramService.createOrUpdate({
          ...thirdMiniProgram,
          status: IThirdMiniProgramStatus.auditFail,
          errmsg: callback.errmsg,
          errcode: callback.errcode,
        });
      }
    }
  }

  @ApiOperation({
    summary: '提交审核',
  })
  @Post('submitAudit')
  @Public()
  async submitAudit(@Body() commitCodeParams: commitCodeDto) {
    const reThirdMiniPrograms =
      await this.getReThirdMiniPrograms(commitCodeParams);
    const recordList: any = [];
    for (const thirdMiniProgram of reThirdMiniPrograms) {
      let record: any = {};
      const token: any = thirdMiniProgram.token;
      const conditionExtraParams = {};
      console.log('commitCodeParams', commitCodeParams);

      // 如果是 LKB 服务商，需要添加其 order_path 参数。这里单独处理。
      if (commitCodeParams.componentAppId === 'wx32948ed89233e87d') {
        conditionExtraParams['order_path'] = '/pages/order/index/index';
      }
      console.log('conditionExtraParams', conditionExtraParams);
      const callback: any = await WeChatApi.submitAudit({
        access_token: token.authorizer_access_token,
        ...conditionExtraParams,
      });

      record = {
        sellerId: thirdMiniProgram.id,
        appId: commitCodeParams.componentAppId,
        extJson: thirdMiniProgram.extJson,
        version: thirdMiniProgram.currentVersion,
        templateId: thirdMiniProgram.templateId,
      };
      if (callback.errmsg === 'ok') {
        if (callback.errcode == 0) {
          this.thirdMiniProgramService.createOrUpdate({
            ...thirdMiniProgram,
            status: IThirdMiniProgramStatus.auditing,
            auditId: callback.auditid,
          });
          record.auditId = callback.auditid;
          record.status = 1;
        } else {
          this.thirdMiniProgramService.createOrUpdate({
            ...thirdMiniProgram,
            status: IThirdMiniProgramStatus.auditFail,
            errmsg: callback.errmsg,
            errcode: callback.errcode,
          });
          record.status = 2;
          record.failReason = callback.errcode;
        }
      } else {
        this.thirdMiniProgramService.createOrUpdate({
          ...thirdMiniProgram,
          status: IThirdMiniProgramStatus.auditFail,
          errmsg: callback.errmsg,
          errcode: callback.errcode,
        });
        record.status = 2;
        record.failReason = callback.errcode;
      }
      recordList.push(record);
    }
    console.log('recordList===>', recordList);

    return reThirdMiniPrograms;
  }

  @ApiOperation({
    summary: '获取历史版本',
  })
  @Post('revertcoderelease')
  @Public()
  async revertcoderelease(@Body() commitCodeParams: commitCodeDto) {
    const reThirdMiniPrograms =
      await this.getReThirdMiniPrograms(commitCodeParams);
    let callback: any;
    for (const thirdMiniProgram of reThirdMiniPrograms) {
      const token: any = thirdMiniProgram.token;
      callback = await WeChatApi.revertcoderelease(
        token.authorizer_access_token,
      );
    }
    return callback;
  }

  @ApiOperation({
    summary: '获取审核状态',
  })
  @Post('getAuditStatus')
  @Public()
  async getAuditStatus(@Body() commitCodeParams: commitCodeDto) {
    const reThirdMiniPrograms =
      await this.getReThirdMiniPrograms(commitCodeParams);
    for (const thirdMiniProgram of reThirdMiniPrograms) {
      const token: any = thirdMiniProgram.token;
      const callback: any = await WeChatApi.getAuditStatus({
        access_token: token.authorizer_access_token,
        auditid: thirdMiniProgram.auditId,
      });
      if (callback.errmsg === 'ok') {
        if (callback.status === 0) {
          this.thirdMiniProgramService.createOrUpdate({
            ...thirdMiniProgram,
            status: IThirdMiniProgramStatus.auditSuccess,
            auditId: callback.auditid,
          });
        } else if (callback.status !== 2) {
          this.thirdMiniProgramService.createOrUpdate({
            ...thirdMiniProgram,
            status: IThirdMiniProgramStatus.auditFail,
            errmsg: callback.reason,
            errcode: callback.status,
          });
        }
      } else {
        this.thirdMiniProgramService.createOrUpdate({
          ...thirdMiniProgram,
          status: IThirdMiniProgramStatus.auditFail,
          errmsg: callback.errmsg,
          errcode: callback.errcode,
        });
      }
    }
    return reThirdMiniPrograms;
  }

  @ApiOperation({
    summary: '设置隐私',
  })
  @Post('setprivacysetting')
  @Public()
  async setprivacysetting(@Body() commitCodeParams: commitCodeDto) {
    const reThirdMiniPrograms =
      await this.getReThirdMiniPrograms(commitCodeParams);
    for (const thirdMiniProgram of reThirdMiniPrograms) {
      const token: any = thirdMiniProgram.token;
      const callback: any = await WeChatApi.getprivacysetting(
        token.authorizer_access_token,
      );

      let { bizConfig }: any = thirdMiniProgram;
      bizConfig = JSON.parse(bizConfig);

      const { setting_list, owner_setting, errmsg, errcode } = callback;
      const RESULT_MAP = {
        UserInfo: '用于识别用户身份，关联用户在系统的信息',
        Location: '根据所在地，查询门店位置',
        Address: '下单发货目的地',
        Invoice: '为用户提供发票查询功能',
        Record: '提供语音输入能力',
        Camera: '提供扫码能力，提供线下扫码核销能力',
        PhoneNumber: '在平台购物后需要联系用户沟通订单信息',
        Contact: '保存卖家客服联系方式',
        EXIDNumber: '跨境购物海关清关需要',
        EXOrderInfo: '追踪用户订单状态',
        AlbumWriteOnly: '跨境购物海关清关需要身份证号上传',
        Email: '提供邮件通知功能',
      };
      if (errcode === 0) {
        await WeChatApi.setprivacysetting({
          appid: bizConfig.attr.wxAppid,
          access_token: token.authorizer_access_token,
          owner_setting,
          setting_list: setting_list.map((setting) => {
            return {
              ...setting,
              privacy_text: RESULT_MAP[setting.privacy_key] || '',
            };
          }),
        });
      } else {
        this.thirdMiniProgramService.createOrUpdate({
          ...thirdMiniProgram,
          status: IThirdMiniProgramStatus.auditFail,
          errmsg: callback.reason,
          errcode: callback.status,
        });
      }
    }
    return reThirdMiniPrograms;
  }

  @ApiOperation({
    summary: '获取体验码',
  })
  @Post('getQrcode')
  @Public()
  async getQrcode(@Body() commitCodeParams: commitCodeDto) {
    const reThirdMiniPrograms =
      await this.getReThirdMiniPrograms(commitCodeParams);
    await WeChatApi.getQrcode(
      reThirdMiniPrograms[0].token.authorizer_access_token,
      reThirdMiniPrograms[0].id,
    );

    this.thirdMiniProgramService.createOrUpdate({
      ...reThirdMiniPrograms[0],
      qrCodeUrl: `preview/${reThirdMiniPrograms[0].name}.jpg`,
    });
    return `preview/${reThirdMiniPrograms[0].name}.jpg`;
  }
}
