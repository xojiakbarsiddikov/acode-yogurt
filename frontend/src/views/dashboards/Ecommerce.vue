<script setup>
import {onMounted, ref, watch} from 'vue';
import {FilterMatchMode} from 'primevue/api';
import {useLayout} from '@/layout/composables/layout';
import {ProductService} from '@/service/ProductService';

const api_url = import.meta.env.VITE_API_URL

const {contextPath, layoutConfig} = useLayout();
const knobValue = ref(90);
const products = ref([]);
const weeks = ref([
  {
    label: 'Last Week',
    value: 0,
    data: [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ]
  },
  {
    label: 'This Week',
    value: 1,
    data: [
      [35, 19, 40, 61, 16, 55, 30],
      [48, 78, 10, 29, 76, 77, 10]
    ]
  }
]);
const selectedWeek = ref(weeks.value[0]);
const pieOptions = ref({});
const barOptions = ref({});
const barData = ref({});
const pieData = ref({});
const salesTableRef = ref(null);
const filterSalesTable = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS}
});

watch(layoutConfig.colorScheme, () => {
  setChartData();
});
const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  pieData.value = {
    labels: ['Electronics', 'Fashion', 'Household'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [documentStyle.getPropertyValue('--primary-700'), documentStyle.getPropertyValue('--primary-400'), documentStyle.getPropertyValue('--primary-100')],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--primary-600'), documentStyle.getPropertyValue('--primary-300'), documentStyle.getPropertyValue('--primary-200')]
      }
    ]
  };

  pieOptions.value = {
    animation: {
      duration: 0
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          usePointStyle: true,
          font: {
            weight: 700
          },
          padding: 28
        },
        position: 'bottom'
      }
    }
  };

  barData.value = {
    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: documentStyle.getPropertyValue('--primary-500'),
        barThickness: 12,
        borderRadius: 12,
        data: selectedWeek.value.data[0]
      },
      {
        label: 'Profit',
        backgroundColor: documentStyle.getPropertyValue('--primary-200'),
        barThickness: 12,
        borderRadius: 12,
        data: selectedWeek.value.data[1]
      }
    ]
  };

  barOptions.value = {
    animation: {
      duration: 0
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          usePointStyle: true,
          font: {
            weight: 700
          },
          padding: 28
        },
        position: 'bottom'
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500
          }
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        }
      }
    }
  };
};
const formatCurrency = (value) => {
  return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
};

const exportCSV = () => {
  salesTableRef.value.exportCSV();
};

const visibleRight = ref(false);
const visibleRightModal = ref(false);
const productService = new ProductService();
const tables = ref(null);
const sums = ref(null);
const minusSums = ref(null);
const allSums = ref(null);
const credit = ref(null);
const finishCredit = ref(null);
const countProducts = ref(0);
const label = ref(null)
const img = ref(null)
const price = ref(0)
const message = ref(null)
const users = ref(null)

onMounted(() => {
  productService.getProductsSmall().then((data) => (products.value = data));
  selectedWeek.value = weeks.value[0];
  setChartData();
  productService.getTables().then((data) => {
    let sum = 0;
    for (var i in data) {
      sum += data[i].price;
    }
    sums.value = sum;
  });
  productService.getProducts().then((data) => {
    minusSums.value = data.length
    label.value = data[1].label
    message.value = data[1].message
    img.value = data[1].img
    price.value = data[1].price
    let sum = 0;
    for (var i in data) {
      sum += data[i].count;
    }
    countProducts.value = sum;
  });
  productService.getFinishTables().then((data) => {
    finishCredit.value = data.length;
  });
  productService.getTables().then((data) => {
    credit.value = data.length;
    let sum = 0;
    for (var i in data) {
      sum += data[i].count;
      allSums.value = countProducts.value - sum;
    }
    tables.value = sum;
  });
  productService.getUsers().then((data) => {
    users.value = data.length - 1
  })
});


const onWeekChange = () => {
  let newBarData = {...barData.value};
  newBarData.datasets[0].data = selectedWeek.value.data[0];
  newBarData.datasets[1].data = selectedWeek.value.data[1];
  barData.value = newBarData;

  setChartData();
};

const openModal = () => {
  visibleRight.value = true;
};

const openDialog = () => {
  visibleRightModal.value = true;
};

const product = ref(24);

watch(
    layoutConfig.colorScheme,
    () => {
      setChartData();
    },
    {immediate: true}
);

watch(
    layoutConfig.theme,
    () => {
      setChartData();
    },
    {immediate: true}
);
</script>

<template>
  <div class='grid'>
    <div class='col-12 md:col-6 xl:col-2'>
      <div class='card h-full flex flex-column align-items-center justify-content-center'>
        <i class='pi pi-slack text-primary text-4xl mb-4'></i>
        <span class='text-900 text-lg mb-4 font-medium'>Jami</span>
        <span class='text-900 text-1xl text-primary font-bold'>Mahsulotlar: &nbsp;{{ countProducts }}<br> Sotilgan mahsulotlar: &nbsp;{{ tables }} <br> Balans: &nbsp;{{ sums }}&nbsp; so'm</span>
      </div>
    </div>
    <div class='col-12 md:col-6 xl:col-2' @click='openDialog'>
      <div class='card h-full flex flex-column align-items-center justify-content-center'>
        <i class='pi pi-cart-plus text-primary text-4xl mb-4'></i>
        <span class='text-900 text-lg mb-4 font-medium cursor'>Mahsulotlar turlari</span>
        <span class='text-900 text-2xl text-primary font-bold cursor' v-if='minusSums'>{{ minusSums }}&nbsp;hil</span>
        <span class='text-900 text-2xl text-primary font-bold cursor' v-else>0 hil</span>
      </div>
    </div>
    <div class='col-12 md:col-6 xl:col-2'>
      <div class='card h-full flex flex-column align-items-center justify-content-center'>
        <i class='pi pi-bitcoin text-primary text-4xl mb-4'></i>
        <span class='text-900 text-lg mb-4 font-medium cursor'>Mahsulotlar Soni</span>
        <span class='text-900 text-2xl text-primary font-bold cursor' v-if='countProducts'>{{ countProducts }}</span>
        <span class='text-900 text-2xl text-primary font-bold cursor' v-else>0</span>
      </div>
    </div>
    <div class='col-12 md:col-6 xl:col-2' @click='openModal'>
      <div class='card h-full flex flex-column align-items-center justify-content-center'>
        <i class='pi pi-user-minus text-primary text-4xl mb-4'></i>
        <span class='text-900 text-lg mb-4 font-medium cursor'>Qolgan mahsulotlar</span>
        <span class='text-900 text-2xl text-primary font-bold cursor' v-if='allSums'>{{ allSums }}</span>
        <span class='text-900 text-2xl text-primary font-bold cursor' v-else>0</span>
      </div>
    </div>
    <div class='col-12 md:col-6 xl:col-2'>
      <router-link :to="'/credit'">
        <div class='card h-full flex flex-column align-items-center justify-content-center'>
          <i class='pi pi-money-bill text-primary text-4xl mb-4'></i>
          <span class='text-900 text-lg mb-4 font-medium cursor'>Qarzdorlar</span>
          <span class='text-900 text-2xl text-primary font-bold cursor' v-if='credit > 0'>{{ credit }}</span>
          <span class='text-900 text-2xl text-primary font-bold cursor' v-else>0</span>
        </div>
      </router-link>
    </div>
    <div class='col-12 md:col-6 xl:col-2'>
      <div class='card h-full flex flex-column align-items-center justify-content-center'>
        <i class='pi pi-dollar text-primary text-4xl mb-4'></i>
        <span class='text-900 text-lg mb-4 font-medium cursor'>Balans</span>
        <span class='text-900 text-2xl text-primary font-bold cursor' v-if='sums'>{{ sums + "so'm" }}</span>
        <span class='text-900 text-2xl text-primary font-bold cursor' v-else>0</span>
      </div>
    </div>
  </div>

  <div class='top-bar position'>
    <div class='header-text'>
      <h4>Top news of the week: &nbsp;<span class='text-primary'>{{ 4 }}</span></h4>
    </div>
    <div class='grid margin-top grid-media'>
      <div class="col-12 lg:col-4">
        <div class="card">
          <div class="text-900 text-xl font-semibold mb-3">{{ label }}</div>
          <ul class="list-none p-0 m-0">
            <li class="flex align-items-center justify-content-between p-3">
              <div class="inline-flex align-items-center">
                <img src="../../assets/yogurt.png" :alt="label" width="75" class="shadow-2 flex-shrink-0"/>
                <div class="flex flex-column ml-3">
                  <span class="font-medium text-lg mb-1">{{ message }}</span>
                </div>
              </div>
              <span class="ml-auto font-semibold text-xl text-primary">{{ price + "so'm" }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-12 md:col-6 xl:col-2">
        <div class="card h-full">
          <span class="font-semibold text-lg">Qarzdorlar</span>
          <div class="flex justify-content-between align-items-start mt-3">
            <div class="w-6">
              <span class="text-3xl font-bold text-900">{{ credit }}</span>
              <div class="text-pink-500 mt-4">
                <span class="font-medium">+24%</span>
                <i class="pi pi-arrow-down text-xs ml-2"></i>
              </div>
            </div>
            <div class="w-6">
              <svg width="100%" viewBox="0 0 115 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1.5 1L2.74444 2.61495C3.98889 4.2299 6.47778 7.4598 8.96667 9.07151C                                    11.4556 10.6832 13.9444 10.6767 16.4333 11.6127C18.9222 12.5487 21.4111 14.4271 23.9 16.6724C26.3889 18.9178 28.8778 21.5301 31.3667 20.1977C33.8556 18.8652 36.3444 13.5878 38.8333 11.3638C41.3222 9.13969 43.8111 9.96891 46.3 11.9894C48.7889 14.0099 51.2778 17.2217 53.7667 16.2045C56.2556 15.1873 58.7444 9.9412 61.2333 11.2783C63.7222 12.6155 66.2111 20.5359 68.7 21.4684C71.1889 22.401 73.6778 16.3458 76.1667 16.0009C78.6556 15.6561 81.1444 21.0217 83.6333 24.2684C86.1222 27.515 88.6111 28.6428 91.1 27.4369C93.5889 26.2311 96.0778 22.6916 98.5667 22.7117C101.056 22.7317 103.544 26.3112 106.033 29.7859C108.522 33.2605 111.011 36.6302 112.256 38.3151L113.5 40"
                    :style="{ strokeWidth : '1px', stroke: 'var(--pink-500)' }"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6 xl:col-2">
        <div class="card h-full">
          <span class="font-semibold text-lg">Balans</span>
          <div class="flex justify-content-between align-items-start mt-3">
            <div class="w-6">
              <span class="text-2xl font-bold text-900">{{ sums + "so'm" }}</span>
              <div class="text-green-500 mt-4">
                <span class="font-medium">+20%</span>
                <i class="pi pi-arrow-up text-xs ml-2"></i>
              </div>
            </div>
            <div class="w-6 mt-5">
              <svg width="100%" viewBox="0 0 115 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 35.6498L2.24444 32.4319C3.48889 29.214 5.97778 22.7782 8.46667 20.3627C10.9556 17.9473 13.4444 19.5522 15.9333 21.7663C18.4222 23.9803 20.9111 26.8035 23.4 30.6606C25.8889 34.5176 28.3778 39.4085 30.8667 37.2137C33.3556 35.0189 35.8444 25.7383 38.3333 26.3765C40.8222 27.0146 43.3111 37.5714 45.8 38.9013C48.2889 40.2311 50.7778 32.3341 53.2667 31.692C55.7556 31.0499 58.2444 37.6628 60.7333 39.4617C63.2222 41.2607 65.7111 38.2458 68.2 34.9205C70.6889 31.5953 73.1778 27.9597 75.6667 23.5955C78.1556 19.2313 80.6444 14.1385 83.1333 13.8875C85.6222 13.6365 88.1111 18.2272 90.6 20.2425C93.0889 22.2578 95.5778 21.6977 98.0667 18.8159C100.556 15.9341 103.044 10.7306 105.533 7.37432C108.022 4.01806 110.511 2.50903 111.756 1.75451L113 1"
                    :style="{ strokeWidth: '1px', stroke: 'var(--primary-color)' }"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6 xl:col-2">
        <div class="card h-full">
          <span class="font-semibold text-lg">Users</span>
          <div class="flex justify-content-between align-items-start mt-3">
            <div class="w-6">
              <span class="text-2xl font-bold text-900">{{ users }}</span>
              <div class="text-green-500 mt-4">
                <span class="font-medium">+10%</span>
                <i class="pi pi-arrow-up text-xs ml-2"></i>
              </div>
            </div>
            <div class="w-6">
              <svg width="100%" viewBox="0 0 115 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1 35.6498L2.24444 32.4319C3.48889 29.214 5.97778 22.7782 8.46667 20.3627C10.9556 17.9473 13.4444 19.5522 15.9333 21.7663C18.4222 23.9803 20.9111 26.8035 23.4 30.6606C25.8889 34.5176 28.3778 39.4085 30.8667 37.2137C33.3556 35.0189 35.8444 25.7383 38.3333 26.3765C40.8222 27.0146 43.3111 37.5714 45.8 38.9013C48.2889 40.2311 50.7778 32.3341 53.2667 31.692C55.7556 31.0499 58.2444 37.6628 60.7333 39.4617C63.2222 41.2607 65.7111 38.2458 68.2 34.9205C70.6889 31.5953 73.1778 27.9597 75.6667 23.5955C78.1556 19.2313 80.6444 14.1385 83.1333 13.8875C85.6222 13.6365 88.1111 18.2272 90.6 20.2425C93.0889 22.2578 95.5778 21.6977 98.0667 18.8159C100.556 15.9341 103.044 10.7306 105.533 7.37432C108.022 4.01806 110.511 2.50903 111.756 1.75451L113 1"
                    :style="{ strokeWidth: '1px', stroke: 'var(--primary-color)' }"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
::v-deep(.rating) {
  .p-rating-icon {
    font-size: 12px;
  }
}

.position {
  position: absolute;
  bottom: 0;
}

.lg\:col-4 {
  width: 46.3333% !important;
}

.grid {
  margin-right: 0 !important
}

@media(max-width: 1200px) {
  .position {
    position: absolute;
    bottom: auto;
    margin: 30px 0 0;
  }
  .lg\:col-4[data-v-f0df914d] {
    width: 100% !important;
  }
  .grid-media {
    margin-right: 0;
  }
}

@media(max-width: 600px) {
  .position {
    position: absolute;
    margin: 44px 0;
    bottom: auto;
  }
  .lg\:col-4 {
    width: 100% !important;
  }
  .grid-media {
    margin-right: 0;
  }
}

@media(max-width: 380px) {
  .text-lg {
    font-size: 1rem !important;
  }
}
</style>
