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
      filter_type_list: ['All','SNS','EC','portal site','IT','porn','hardware','search engine','blog','video','knowledge market','service','language','CNCF','Web3','Infrastructure','Game','AI','Security','FinTech','SaaS','Communication','Design','Music','Education'],
      //nationality
      filter_nationality: '',
      filter_nationality_list: ['日本','アメリカ','ドイツ','アイルランド','中国','韓国','カナダ','ハンガリー','オランダ','フランス','イギリス','エストニア','スウェーデン','ロシア','ウクライナ','オーストラリア','スイス'],
      //era
      filter_era: '',
      filter_era_list: ['平成','昭和','大正','明治'],
      //jsonファイルを読み込む
      items: items
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
  <div>
    <!-- Search -->
    <div class="form-group">
      <input type="text" v-model="keyword" placeholder="Search">
    </div>
    <!-- Filter -->
    <div class="filter-items-group">
      <!-- type -->
      <div class="filter-items">
        <ul>
          <li v-for="filter in filter_type_list">
              <button href="#" v-on:click="type_filter(filter)" :class="{'active': isActive === filter}">{{ filter }}({{ counts(filter) }})</button>
          </li>
        </ul>
      </div>
      <!-- nationality -->
      <div class="filter-items">
        <ul>
          <li v-for="filter in filter_nationality_list">
              <button v-on:click="type_filter(filter)" :class="{'active': isActive === filter}">{{ filter }}({{ counts(filter) }})</button>
          </li>
        </ul>
      </div>
      <!-- era -->
      <div class="filter-items">
        <ul>
          <li v-for="filter in filter_era_list">
              <button v-on:click="type_filter(filter)" :class="{'active': isActive === filter}">{{ filter }}({{ counts(filter) }})</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="container">
      <div v-for="item in filteredItems" :key="item.name">
        <section>
          <h1>{{ item.date }} <img :src="'/flag/' + item.nationality + '.png'"></h1>
          <p>{{ item.name }}</p>
          <img :src="'/' + item.img" >
          <p>{{ item.description }}</p>
        </section>
      </div>
  </div>
</div>
</template>

<style>
.form-group{
  text-align: center;
}

.form-group input{
  outline: 0;
  border: 0;
}

.form-group input[type="text"]{
  width: 256px;
  padding: 8px 4px 6px 4px;
  background: #FAFAFA;
  font-size: 1.2rem;
  border-bottom: 1px solid rgba(0,0,0,.4);
}

.filter-items-group {
  padding-top: 15px;
}
.filter-items {
  text-align: center;
}

.filter-items ul{
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.8em;
  justify-content: center;
  list-style-type: none;
  margin: 0;
  padding: 0 0 15px 0;
}

@media screen and ( min-width: 700px ){
  .filter-items li:not(:first-of-type):before {
    content: ' - ';
    display: inline-block;
    margin: 0 2px;
    padding: 0 5px;
  }
}

.filter-items li button{
  /*outline: 0;*/
  border: 0;
  background: #FAFAFA;
  font-size: 1em;
  margin: 0;
  display: inline-block;
  min-width: 40px;
  padding: 10px 10px;
  text-align: center;
}

.filter-items .active{
  font-weight: bold;
}

.container{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.container section{
  width: 300px;
  height: 100%;
  margin: 10px;
  padding: 15px;
}

.container section img{
  height: 50px;
  width: auto;
  max-width: 100%;
}

.container h1{
  font-size: 1.5rem;
}

.container h1 img{
  height: 1rem;
  width: auto;
}

.container p{
  margin-top: 10px;
}

</style>
