import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Dish } from '../../shared/dish';
import { Observable } from 'rxjs/Observable';
import { DishProvider } from '../dish/dish';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';


/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoriteProvider {

  favorites: Array<any>;

  constructor(public http: Http,
    private dishservice: DishProvider,private storage: Storage,
    private localNotifications: LocalNotifications) { 

    console.log('Hello FavoriteProvider Provider');
    this.favorites = [];
    storage.get('favorites').then(favorites => {
      if (favorites) {
        console.log("Grabbing favorites from storage", favorites);
        this.favorites = favorites;
      } else {
        console.log("favorites not defined");
      }
    });
  }

  addFavorite(id: number): boolean {
    if (!this.isFavorite(id)){
      this.favorites.push(id);
      this.updateStorage();
    }

    // Schedule a single notification
    this.localNotifications.schedule({
      id: id,
      text: 'Dish ' + id + ' added as a favorite successfully'
    });
    console.log('favorites', this.favorites);
    return true;
  }

  isFavorite(id: number): boolean {
        return this.favorites.some(el => el === id);
  }

  getFavorites(): Observable<Dish[]> {
    return this.dishservice.getDishes()
      .map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id)));
  }

  deleteFavorite(id: number): Observable<Dish[]> {
    let index = this.favorites.indexOf(id);
    if (index >= 0) {
      this.favorites.splice(index,1);
      this.updateStorage();
      return this.getFavorites();
    }
    else {
      console.log('Deleting non-existant favorite', id);
      return Observable.throw('Deleting non-existant favorite' + id);
    }
  }

  updateStorage() {
    console.log("Updating storage");
    this.storage.set('favorites', this.favorites);
  }
}
