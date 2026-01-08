<script>
import items from '../../info.json'

//検索
const search = (keyword,items) => {
  var keyword_items = [];
  for(var i in items){
    var pre_keyword = items[i];
    if(pre_keyword.name.indexOf(keyword) !== -1){
      keyword_items.push(pre_keyword);
    }else if(pre_keyword.description.indexOf(keyword) !== -1){
      keyword_items.push(pre_keyword);
    }
  }
  return keyword_items;
}
//type検索
const type_search = (type,items) => {
  var filtered_items = [];
  for(var i in items){
    var pre_name = items[i];
    if(pre_name.type.indexOf(type) !== -1){
      filtered_items.push(pre_name);
    }
  }
  return filtered_items;
}

export default{
  data(){
    return{
      isActive: 'All',
      keyword: '',
      active: false, //Make all the default active
      //type
      filter_type: '',
      filter_type_list: ['All','SNS','EC','portal site','IT','porn','hardware','search engine','blog','video','knowledge market','service','language','CNCF','Web3','Infrastructure','Game','AI','Security','FinTech','SaaS','Communication','Design','Music','Education','OS','tool','Piracy','Dark Web'],
      //nationality
      filter_nationality: '',
      filter_nationality_list: ['日本','アメリカ','ドイツ','アイルランド','中国','韓国','カナダ','ハンガリー','オランダ','フランス','イギリス','エストニア','スウェーデン','ロシア','ウクライナ','オーストラリア','スイス','フィンランド','台湾','シンガポール','インドネシア','アルゼンチン','ケニア','インド','カザフスタン','香港'],
      //era
      filter_era: '',
      filter_era_list: ['平成','昭和','大正','明治'],
      //jsonファイルを読み込む
      items: items,
      publicPath: import.meta.env.BASE_URL
    }
  },
  computed: {
    sortedItemsByDate(){
      return this.items.sort((a,b) => {
        return (a.date < b.date) ? -1 : (a.date > b.date ) ? 1 : 0
      })
    },
    filteredItems(){
      if(this.active){
        //type
        if(this.filter_type != ''){
          var filtered_items = type_search(this.filter_type,this.sortedItemsByDate);
          //検索
          if(this.keyword != ''){
            return search(this.keyword,filtered_items);
          }else{
            return filtered_items;
          }
        }
      }else{
        if(this.keyword != ''){
          return search(this.keyword,this.sortedItemsByDate);
        }else{
          return this.sortedItemsByDate;
        }
      }
    }
  },
  methods: {
    type_filter(event){
      this.isActive = event;
      if(event == "All"){
        this.active = false;
      }else{
        this.active = true;
        this.filter_type = event;
      }
    },
    counts(type){
      if(type == 'All'){
        return this.items.length;
      }else{
        console.log(search(type,this.items));
        var count = type_search(type,this.items).length;
        return count;
      }
    }
  }
}
</script>

<template>
  <div class="main-wrapper">
    <!-- Search -->
    <div class="search-container">
      <input type="text" v-model="keyword" :placeholder="$t('search.placeholder')" class="search-input">
    </div>

    <!-- Filter (Horizontal Scroll) -->
    <div class="filters-container">
      <!-- Type Filter -->
      <div class="filter-group">
        <div class="filter-label">Category</div>
        <div class="filter-scroll">
          <button 
            v-for="filter in filter_type_list" 
            :key="filter"
            @click="type_filter(filter)" 
            :class="['filter-chip', {'active': isActive === filter}]">
            {{ $t('filters.types.' + filter) }}
            <span class="count">{{ counts(filter) }}</span>
          </button>
        </div>
      </div>

      <!-- Nationality Filter -->
      <div class="filter-group">
        <div class="filter-label">Nationality</div>
        <div class="filter-scroll">
          <button 
            v-for="filter in filter_nationality_list" 
            :key="filter"
            @click="type_filter(filter)" 
            :class="['filter-chip', {'active': isActive === filter}]">
            {{ $t('filters.nationalities.' + filter) }}
            <span class="count">{{ counts(filter) }}</span>
          </button>
        </div>
      </div>

      <!-- Era Filter -->
      <div class="filter-group">
        <div class="filter-label">Era</div>
        <div class="filter-scroll">
          <button 
            v-for="filter in filter_era_list" 
            :key="filter"
            @click="type_filter(filter)" 
            :class="['filter-chip', {'active': isActive === filter}]">
            {{ $t('filters.eras.' + filter) }}
            <span class="count">{{ counts(filter) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid-container">
      <div v-for="item in filteredItems" :key="item.name" class="card">
        <div class="card-header">
          <span class="date">{{ item.date }}</span>
          <img :src="publicPath + 'flag/' + item.nationality + '.png'" class="flag" :alt="item.nationality">
        </div>
        <div class="card-body">
          <div class="logo-container">
            <img :src="publicPath + item.img" :alt="item.name" class="logo">
          </div>
          <h2 class="name">{{ item.name }}</h2>
          <p class="desc">{{ $i18n.locale === 'en' && item.description_en ? item.description_en : item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Search */
.search-container {
  margin-bottom: 2rem;
  text-align: center;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  font-family: var(--font-main);
  border: var(--border-width) solid var(--text-color);
  border-radius: 999px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  box-shadow: 4px 4px 0px var(--text-color);
  transform: translate(-2px, -2px);
}

/* Filters */
.filters-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
}

.filter-scroll {
  display: flex;
  gap: 0.8rem;
  overflow-x: auto;
  padding-bottom: 0.5rem; /* Scrollbar space */
  scrollbar-width: thin;
}

.filter-scroll::-webkit-scrollbar {
  height: 4px;
}
.filter-scroll::-webkit-scrollbar-thumb {
  background-color: var(--text-color);
  border-radius: 4px;
}

.filter-chip {
  flex: 0 0 auto;
  background: transparent;
  border: var(--border-width) solid var(--text-color);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-chip:hover {
  background-color: #f0f0f0;
}

.filter-chip.active {
  background-color: var(--text-color);
  color: var(--bg-color);
  box-shadow: 2px 2px 0px rgba(0,0,0,0.2);
}

.filter-chip .count {
  font-size: 0.8em;
  margin-left: 4px;
  opacity: 0.8;
}

/* Grid & Cards */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.card {
  border: var(--border-width) solid var(--text-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  background: var(--bg-color);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text-color);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--text-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: bold;
}

.flag {
  height: 1.2rem;
  width: auto;
  border: 1px solid #eee; /* subtle border for white flags */
}

.logo-container {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.name {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.desc {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
  flex-grow: 1; /* Push footer down if we had one */
}
</style>
