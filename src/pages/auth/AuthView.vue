<script setup>
import AuthFormComponent from '@/pages/auth/components/AuthFormComponent.vue'
</script>

<template>
  <div class="login-page">
    <a-row class="h-100" :gutter="16" align="middle" justify="center">
      <a-col :span="10" class="login-form">
        <a-card shadow>
          <div class="auth-form">
            <div>
              <h1 class="text-center text-bold">
                ADS-<span class="text-primary text-bold">PRO</span>
              </h1>
              <p class="text-muted text-center mb-0">
                {{ $t('LOGIN_PAGE_DESCRIPTION') }}
              </p>
            </div>
            <auth-form-component />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variable';
@import '@/assets/styles/responsive';

.login-page {
  height: 100vh;

  @include responsive-xs {
    padding: 0;
  }
  @include responsive-sm {
    display: block;
  }
  @include responsive-md {
    padding: 3rem;
  }
  @include responsive-lg {
    display: block;
  }
  .ant-row {
    height: 100%;
    margin: 0 !important;
    padding: 0 2px 0 2px;
    .login-page-banner {
      display: none;
      @include responsive-xs {
        display: none;
      }
      @include responsive-sm {
        display: none;
      }
      @include responsive-md {
        display: none;
      }
      @include responsive-lg {
        display: block;
      }

      .login-image {
        width: 89%;
      }
    }
    .login-form {
      .ant-card {
        @include responsive-xs {
          max-width: 100%;
        }
        @include responsive-sm {
          max-width: 460px;
          margin: 0 auto;
        }
        @include responsive-md {
          max-width: 460px;
        }
        @include responsive-lg {
          max-width: 100%;
        }
        &:deep(.ant-card-body) {
          padding: 12px !important;
        }
      }
    }
  }

  .auth-form {
    display: block;
    width: 100%;
    max-height: calc(100vh - 110px);
    margin: 0 auto;
    overflow: auto;
    padding: 4px;
    @include responsive-lg {
      display: block;
      padding: 0 46px 0 46px;
    }
  }
}
</style>
